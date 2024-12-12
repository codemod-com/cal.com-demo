import { useTranslation } from "react-i18next";
import { Table } from "./Table";
import { TableActions } from "./TableActions";
import {
  Table as TableNew,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableCaption,
} from "./TableNew";

export const TableNewExampleComponent = () =>  {
const { t } = useTranslation();

return (
  <TableNew>
    <TableHeader>
      <TableRow>
        <TableHead>{t('header-column-1')}</TableHead>
        <TableHead>{t('header-column-2')}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>{t('row-1-cell-1')}</TableCell>
        <TableCell>{t('row-1-cell-2')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{t('row-2-cell-1')}</TableCell>
        <TableCell>{t('row-2-cell-2')}</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>{t('row-3-footer-cell-1')}</TableCell>
        <TableCell>{t('row-3-footer-cell-2')}</TableCell>
      </TableRow>
    </TableFooter>
    <TableCaption>{t('table-caption')}</TableCaption>
  </TableNew>
)
};

export const TableExampleComponent = () =>  {
const { t } = useTranslation();

return (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.ColumnTitle>{t('title-column-1')}</Table.ColumnTitle>
        <Table.ColumnTitle>{t('title-column-2')}</Table.ColumnTitle>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>{t('row-1-cell-1-duplicate')}</Table.Cell>
        <Table.Cell>{t('row-1-cell-2-duplicate')}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>{t('row-2-cell-1-duplicate')}</Table.Cell>
        <Table.Cell>{t('row-2-cell-2-duplicate')}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <TableActions
          actions={[
            {
              id: "action1",
              label: "Action 1",
              href: "#1",
            },
            {
              id: "action2",
              label: "Action 2",
              actions: [
                {
                  id: "action3",
                  label: "Action 3",
                  href: "#nested-action",
                },
              ],
            },
          ]}
        />
      </Table.Row>
    </Table.Body>
  </Table>
)
};
