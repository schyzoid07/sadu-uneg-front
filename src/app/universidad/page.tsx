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
import { CheckIcon, HammerIcon, Trash2Icon, X } from "lucide-react";

export default function Universidad() {
  const university = [
    {
      id: 1,
      name: "Nickolaus",
      local: false,
    },
    {
      id: 2,
      name: "Tyrus",
      local: true,
    },
    {
      id: 3,
      name: "Edee",
      local: true,
    },
    {
      id: 4,
      name: "Obadiah",
      local: false,
    },
    {
      id: 5,
      name: "Haroun",
      local: false,
    },
    {
      id: 6,
      name: "Hashim",
      local: false,
    },
    {
      id: 7,
      name: "Loella",
      local: false,
    },
    {
      id: 8,
      name: "Isidro",
      local: true,
    },
    {
      id: 9,
      name: "Madelena",
      local: false,
    },
    {
      id: 10,
      name: "Nappy",
      local: false,
    },
  ];

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Local</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {university.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.id}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.local ? <CheckIcon /> : <X />}</TableCell>
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
