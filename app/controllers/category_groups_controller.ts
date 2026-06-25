import CategoryGroup from '#models/category_group';
import type { HttpContext } from '@adonisjs/core/http';
import { tHttp } from '#services/http_i18n';
import { DateTime } from 'luxon';

import {
  createCategoryGroupValidator,
  updateCategoryGroupValidator,
} from '#validators/category_group';

export default class CategoryGroupsController {
  private findByNormalizedName(userId: number, name: string) {
    return CategoryGroup.query()
      .where('user_id', userId)
      .whereRaw('LOWER(name) = ?', [name.toLocaleLowerCase()]);
  }

  async index({ inertia }: HttpContext) {
    return inertia.render('simple_cruds/category.group', {});
  }

  async list({ request, auth, response }: HttpContext) {
    const userId = auth.user!.id;
    const searchText = request.input('searchText', null);
    const page = request.input('page', 1);

    const categoryGroups = await CategoryGroup.query()
      .where('user_id', userId)
      .where('archived', false)
      .orderBy('position', 'asc')
      .orderBy('id', 'asc')
      .where((query) => {
        if (searchText) {
          query.where('name', 'like', `%${searchText}%`);
        }
      })
      .paginate(page, 5);

    return response.ok({ categoryGroups });
  }

  async show({ auth, params, response, i18n }: HttpContext) {
    const categoryGroup = await CategoryGroup.query()
      .where('id', params.id)
      .where('user_id', auth.user!.id)
      .where('archived', false)
      .first();

    if (!categoryGroup) {
      return response.notFound({ message: tHttp(i18n, 'categoryGroupNotFound') });
    }

    return response.ok({ data: categoryGroup });
  }

  async store({ auth, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;
    const payload = await request.validateUsing(createCategoryGroupValidator);
    const existing = await this.findByNormalizedName(userId, payload.name).first();

    if (existing) {
      return response.conflict({ message: tHttp(i18n, 'categoryGroupNameAlreadyExists') });
    }

    const categoryGroup = await CategoryGroup.create({
      userId,
      name: payload.name,
      position: payload.position ?? 0,
      archived: false,
      archivedAt: null,
    });

    return response.created({ data: categoryGroup });
  }

  async update({ auth, params, request, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const categoryGroup = await CategoryGroup.query()
      .where('id', params.id)
      .where('user_id', userId)
      .where('archived', false)
      .first();

    if (!categoryGroup) {
      return response.notFound({ message: tHttp(i18n, 'categoryGroupNotFound') });
    }

    const payload = await request.validateUsing(updateCategoryGroupValidator);

    if (payload.name.toLocaleLowerCase() !== categoryGroup.name.toLocaleLowerCase()) {
      const existing = await this.findByNormalizedName(userId, payload.name)
        .whereNot('id', categoryGroup.id)
        .first();

      if (existing) {
        return response.conflict({ message: tHttp(i18n, 'categoryGroupNameAlreadyExists') });
      }
    }

    categoryGroup.merge({
      name: payload.name,
      position: payload.position,
    });

    await categoryGroup.save();

    return response.ok({ data: categoryGroup });
  }

  async archive({ auth, params, response, i18n }: HttpContext) {
    const userId = auth.user!.id;

    const categoryGroup = await CategoryGroup.query()
      .where('id', params.id)
      .where('user_id', userId)
      .first();

    if (!categoryGroup) {
      return response.notFound({ message: tHttp(i18n, 'categoryGroupNotFound') });
    }

    if (!categoryGroup.archived) {
      categoryGroup.archived = true;
      categoryGroup.archivedAt = DateTime.utc();
      await categoryGroup.save();
    }

    return response.ok({ data: categoryGroup });
  }
}
