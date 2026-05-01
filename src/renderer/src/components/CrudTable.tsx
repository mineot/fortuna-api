import { Input, Button, Table } from '@components';

export function CrudTable() {
  return (
    <div className="crud-table-widget">
      <div className="data">
        <Table />
        {/* <table>
          <thead>
            <tr>
              <th>Head 1</th>
              <th>Head 2</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>val1</td>
              <td>val1</td>
              <td>
                <i className="icon-trash"></i>
              </td>
            </tr>
          </tbody>
        </table> */}
        <div>Paginator</div>
        <div className="actions">
          <Button label="Novo" icon="icon-plus" />
        </div>
      </div>
      <div className="editor">
        <Input id="head1" label="Head 1" />
        <Input id="head2" label="Head 2" />
        <div className="action">
          <Button label="Salvar" icon="icon-save" />
          <Button label="Cancelar" icon="icon-ban" />
        </div>
      </div>
    </div>
  );
}
