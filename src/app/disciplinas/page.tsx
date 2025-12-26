import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HammerIcon, Trash2Icon } from "lucide-react";

export default function Disciplinas() {
  const disciplines = [
    {
      id: 1,
      name: "Futbol",
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
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>

          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {disciplines.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.id}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>
              <Button
                size="icon"
                variant="ghost"
                className="bg-blue-100 hover:bg-blue-200 "
              >
                <HammerIcon />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-red-100 hover:bg-red-200"
              >
                <Trash2Icon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
