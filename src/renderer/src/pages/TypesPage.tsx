import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Types } from '@db/schema';

import { insertType, listTypes, removeType, updateType } from '../services/types.service';

type EditableRow = {
  id?: number;
  group: string;
  value: string;
  isNew: boolean;
};

export function TypesPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Types[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<EditableRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      const term = search.trim();
      const types = await listTypes(term ? { group: term, name: term } : undefined);
      setRows(types);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('pages.types.errors.load'));
    }
  }, [search, t]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const visibleRows = useMemo(() => {
    if (!editingRow?.isNew) {
      return rows;
    }

    return [
      {
        id: -1,
        group: editingRow.group,
        value: editingRow.value,
      },
      ...rows,
    ];
  }, [editingRow, rows]);

  function handleNew(): void {
    setSelectedId(null);
    setError(null);
    setEditingRow({
      group: '',
      value: '',
      isNew: true,
    });
  }

  function handleEdit(item: Types): void {
    setSelectedId(item.id);
    setError(null);
    setEditingRow({
      id: item.id,
      group: item.group,
      value: item.value,
      isNew: false,
    });
  }

  function handleCancel(): void {
    setEditingRow(null);
  }

  async function handleSave(): Promise<void> {
    if (!editingRow) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingRow.isNew) {
        await insertType({
          group: editingRow.group,
          value: editingRow.value,
        });
      } else if (editingRow.id !== undefined) {
        await updateType({
          id: editingRow.id,
          group: editingRow.group,
          value: editingRow.value,
        });
      }

      setEditingRow(null);
      await loadRows();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('pages.types.errors.load'));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: number): Promise<void> {
    setError(null);
    try {
      await removeType({ id });
      if (selectedId === id) {
        setSelectedId(null);
      }
      await loadRows();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('pages.types.errors.load'));
    }
  }

  return (
    <section className="page">
      <h2 className="page-title">{t('pages.types.title')}</h2>
      <div className="types-toolbar">
        <button className="table-action-btn" type="button" onClick={handleNew} disabled={saving}>
          {t('pages.types.actions.new')}
        </button>
        <input
          className="types-search-input"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('pages.types.searchPlaceholder')}
        />
      </div>
      {error ? <p className="error">{error}</p> : null}
      <table className="data-table">
        <thead className="data-table-head">
          <tr>
            <th>{t('pages.types.headers.group')}</th>
            <th>{t('pages.types.headers.value')}</th>
            <th>{t('pages.types.headers.actions')}</th>
          </tr>
        </thead>
        <tbody className="data-table-body">
          {visibleRows.length === 0 ? (
            <tr>
              <td className="data-table-empty" colSpan={3}>
                {t('pages.types.empty')}
              </td>
            </tr>
          ) : (
            visibleRows.map((item) => {
              const isNewRow = item.id === -1;
              const isEditing =
                editingRow !== null &&
                ((editingRow.isNew && isNewRow) || (!editingRow.isNew && editingRow.id === item.id));
              const isSelected = !isEditing && selectedId === item.id;

              return (
                <tr
                  key={`${item.id}-${item.group}-${item.value}`}
                  className={isSelected ? 'data-table-row-selected' : undefined}
                  onClick={() => {
                    if (isNewRow) {
                      return;
                    }
                    handleEdit(item);
                  }}
                >
                  <td>
                    {isEditing ? (
                      <input
                        className="table-inline-input"
                        value={editingRow.group}
                        onChange={(event) =>
                          setEditingRow((prev) => (prev ? { ...prev, group: event.target.value } : prev))
                        }
                      />
                    ) : (
                      item.group
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className="table-inline-input"
                        value={editingRow.value}
                        onChange={(event) =>
                          setEditingRow((prev) => (prev ? { ...prev, value: event.target.value } : prev))
                        }
                      />
                    ) : (
                      item.value
                    )}
                  </td>
                  <td className="table-actions-cell">
                    {isEditing ? (
                      <div className="table-action-group">
                        <button
                          className="table-action-btn"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleSave();
                          }}
                          disabled={saving}
                        >
                          {t('pages.types.actions.save')}
                        </button>
                        <button
                          className="table-action-btn table-action-btn-secondary"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleCancel();
                          }}
                          disabled={saving}
                        >
                          {t('pages.types.actions.cancel')}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="table-action-btn table-action-btn-danger"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item.id !== -1) {
                            void handleRemove(item.id);
                          }
                        }}
                      >
                        {t('pages.types.actions.remove')}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
