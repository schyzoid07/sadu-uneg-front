import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Alumnos() {
  const students = [
    {
      id: 1,
      carrerId: 1,
      firstName: "Alaric",
      lastName: "Petrolli",
      identityCard: 73567072,
      email: "apetrolli0@cafepress.com",
      telephone: "326-209-9706",
      gender: "M",
    },
    {
      id: 2,
      carrerId: 2,
      firstName: "Abagael",
      lastName: "Laite",
      identityCard: 82450146,
      email: "alaite1@epa.gov",
      telephone: "871-227-1337",
      gender: "F",
    },
    {
      id: 3,
      carrerId: 3,
      firstName: "Sibyl",
      lastName: "Juza",
      identityCard: 89509085,
      email: "sjuza2@infoseek.co.jp",
      telephone: "357-882-1147",
      gender: "F",
    },
    {
      id: 4,
      carrerId: 4,
      firstName: "Adriana",
      lastName: "Shard",
      identityCard: 8408150,
      email: "ashard3@forbes.com",
      telephone: "125-168-8986",
      gender: "F",
    },
    {
      id: 5,
      carrerId: 5,
      firstName: "Robert",
      lastName: "Semor",
      identityCard: 57904966,
      email: "rsemor4@cpanel.net",
      telephone: "952-916-9135",
      gender: "M",
    },
    {
      id: 6,
      carrerId: 6,
      firstName: "Roberta",
      lastName: "Scripps",
      identityCard: 15303792,
      email: "rscripps5@wisc.edu",
      telephone: "819-428-8324",
      gender: "F",
    },
    {
      id: 7,
      carrerId: 7,
      firstName: "Marcelle",
      lastName: "Anton",
      identityCard: 69254081,
      email: "manton6@amazon.com",
      telephone: "860-915-3177",
      gender: "F",
    },
    {
      id: 8,
      carrerId: 8,
      firstName: "Clevey",
      lastName: "Kleinhausen",
      identityCard: 32748748,
      email: "ckleinhausen7@ask.com",
      telephone: "928-961-1571",
      gender: "M",
    },
    {
      id: 9,
      carrerId: 9,
      firstName: "Kendall",
      lastName: "Boatwright",
      identityCard: 91709343,
      email: "kboatwright8@blinklist.com",
      telephone: "228-323-6974",
      gender: "M",
    },
    {
      id: 10,
      carrerId: 10,
      firstName: "Simon",
      lastName: "Brotherhood",
      identityCard: 2852863,
      email: "sbrotherhood9@blogtalkradio.com",
      telephone: "584-803-5569",
      gender: "M",
    },
  ];
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cedula</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead className="text-right">Correo</TableHead>
          <TableHead className="text-right">Telefono</TableHead>
          <TableHead className="text-right">genero</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.identityCard}</TableCell>
            <TableCell>{data.firstName}</TableCell>
            <TableCell>{data.lastName}</TableCell>
            <TableCell className="text-right">{data.email}</TableCell>
            <TableCell className="text-right">{data.telephone}</TableCell>
            <TableCell className="text-right">{data.gender}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
