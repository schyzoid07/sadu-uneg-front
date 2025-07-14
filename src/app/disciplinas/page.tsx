import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Disciplinas() {
  const disciplines = [
    {
      id: 1,
      name: "Harbert",
    },
    {
      id: 2,
      name: "Marketa",
    },
    {
      id: 3,
      name: "Clair",
    },
    {
      id: 4,
      name: "Di",
    },
    {
      id: 5,
      name: "Cletis",
    },
    {
      id: 6,
      name: "Karlotta",
    },
    {
      id: 7,
      name: "Channa",
    },
    {
      id: 8,
      name: "Gerard",
    },
    {
      id: 9,
      name: "Raquela",
    },
    {
      id: 10,
      name: "Diane",
    },
  ];
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {disciplines.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
