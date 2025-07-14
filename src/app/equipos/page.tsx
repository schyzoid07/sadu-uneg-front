import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Equipos() {
  const teams = [
    {
      id: 1,
      name: "Cecelia",
      disciplineId: 1,
      regular: false,
      universityId: 1,
      category: "Kitchen",
    },
    {
      id: 2,
      name: "Mozelle",
      disciplineId: 2,
      regular: false,
      universityId: 2,
      category: "Food - Frozen Foods",
    },
    {
      id: 3,
      name: "Court",
      disciplineId: 3,
      regular: true,
      universityId: 3,
      category: "Toys",
    },
    {
      id: 4,
      name: "Paige",
      disciplineId: 4,
      regular: true,
      universityId: 4,
      category: "Food - Meat",
    },
    {
      id: 5,
      name: "Benedick",
      disciplineId: 5,
      regular: false,
      universityId: 5,
      category: "Kitchen",
    },
    {
      id: 6,
      name: "Jacqueline",
      disciplineId: 6,
      regular: false,
      universityId: 6,
      category: "Food - Salads",
    },
    {
      id: 7,
      name: "Alexio",
      disciplineId: 7,
      regular: true,
      universityId: 7,
      category: "Food - Produce",
    },
    {
      id: 8,
      name: "Adelaida",
      disciplineId: 8,
      regular: true,
      universityId: 8,
      category: "Fitness",
    },
    {
      id: 9,
      name: "Heidie",
      disciplineId: 9,
      regular: false,
      universityId: 9,
      category: "Clothing - Outerwear",
    },
    {
      id: 10,
      name: "Ricardo",
      disciplineId: 10,
      regular: true,
      universityId: 10,
      category: "Toys",
    },
  ];

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Disciplina</TableHead>
          <TableHead>Universidad</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Titular</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.disciplineId}</TableCell>
            <TableCell>{data.universityId}</TableCell>
            <TableCell>{data.category}</TableCell>
            <TableCell>{data.regular}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
