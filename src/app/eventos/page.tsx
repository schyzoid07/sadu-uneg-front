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

export default function Eventos() {
  const events = [
    {
      id: 1,
      name: "Kristan",
    },
    {
      id: 2,
      name: "Hesther",
    },
    {
      id: 3,
      name: "Courtnay",
    },
    {
      id: 4,
      name: "Hall",
    },
    {
      id: 5,
      name: "Brittni",
    },
    {
      id: 6,
      name: "Lurette",
    },
    {
      id: 7,
      name: "Ricki",
    },
    {
      id: 8,
      name: "Phedra",
    },
    {
      id: 9,
      name: "Maxim",
    },
    {
      id: 10,
      name: "Salomone",
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
        {events.map((data) => (
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
