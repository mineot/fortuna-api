import { Button } from '@widgets';
import type { TableProps } from './_table.types';

export function Table(props: TableProps) {
  return (
    <div className="d-flex flex-column gap-2">
      <table className="table table-sm table-hover m-0">
        <thead>
          <tr>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="align-middle">Mark</td>
            <td className="align-middle">Otto</td>
            <td className="align-middle">@mdo</td>
            <td>
              <div className="d-flex gap-2 align-items-center justify-content-center">
                <Button variant="secondary" icon="pencil-fill" />
                <Button variant="danger" icon="trash3-fill" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="pagination pagination-sm">
        <li className="page-item">
          <button className="page-link">Previous</button>
        </li>
        <li className="page-item active">
          <button className="page-link">1</button>
        </li>
        <li className="page-item">
          <button className="page-link">2</button>
        </li>
        <li className="page-item">
          <button className="page-link">3</button>
        </li>
        <li className="page-item">
          <button className="page-link">Next</button>
        </li>
      </ul>
    </div>
  );
}
