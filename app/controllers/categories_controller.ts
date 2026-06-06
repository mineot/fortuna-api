import Category from '#models/category';
import CategoryGroup from '#models/category_group';
import { createCategoryValidator, updateCategoryValidator } from '#validators/category';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';

export default class CategoriesController {
  private findByNormalizedName(userId: number, name: string) {
    return Category.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  async index({ auth, response }: HttpContext) {
    const userId = auth.user!.id;

    const categories = await Category.query()
      .where('user_id', userId)
      .where('archived', false)
      .preload('categoryGroup')
      .orderBy('position', 'asc')
      .orderBy('id', 'asc');

    return response.ok({ data: categories });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCategoryValidator);

    const categoryGroup = await CategoryGroup.query()
      .where('id', payload.categoryGroupId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!categoryGroup) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Category group not found for this user'),
      });
    }

    const existing = await this.findByNormalizedName(userId, payload.name).first();

    if (existing) {
      return response.conflict({ message: tHttp(i18n, 'Category name already exists') });
    }

    const category = await Category.create({
      userId,
      categoryGroupId: payload.categoryGroupId,
      name: payload.name,
      type: payload.type,
      color: payload.color,
      icon: payload.icon,
      position: payload.position ?? 0,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: category });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const category = await Category.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!category) {
      return response.notFound({ message: tHttp(i18n, 'Category not found') });
    }

    const payload = await request.validateUsing(updateCategoryValidator);

    const categoryGroup = await CategoryGroup.query()
      .where('id', payload.categoryGroupId)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!categoryGroup) {
      return response.unprocessableEntity({
        message: tHttp(i18n, 'Category group not found for this user'),
      });
    }

    if (payload.name.toLocaleLowerCase() !== category.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', category.id)
        .first();

      if (existing) {
        return response.conflict({ message: tHttp(i18n, 'Category name already exists') });
      }
    }

    category.merge({
      categoryGroupId: payload.categoryGroupId,
      name: payload.name,
      type: payload.type,
      color: payload.color,
      icon: payload.icon,
      position: payload.position,
    });

    await category.save();

    return response.ok({ data: category });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const category = await Category.query().where('id', params.id).where('user_id', userId).first();

    if (!category) {
      return response.notFound({ message: tHttp(i18n, 'Category not found') });
    }

    if (!category.archived) {
      category.archived = true;
      category.archivedAt = DateTime.now();
      await category.save();
    }

    return response.ok({ data: category });
  }
}
