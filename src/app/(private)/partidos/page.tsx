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

export default function Partidos() {
  const games = [
    {
      id: 1,
      name: "Jeannine",
      date: "7/12/2025",
      eventId: 1,
      oponent: "jgarmanson0",
      localTeam: "jrainton0",
      hour: "16:30",
      winner: "jfeedham0",
      remark:
        "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
      pointResultsLocal: 1,
      pointResultsOponent: 1,
      location: "10",
    },
    {
      id: 2,
      name: "Clemente",
      date: "11/5/2024",
      eventId: 2,
      oponent: "cwickett1",
      localTeam: "cpretley1",
      hour: "08:00",
      winner: "cmccuthais1",
      remark:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.",
      pointResultsLocal: 2,
      pointResultsOponent: 2,
      location: "67050",
    },
    {
      id: 3,
      name: "Lauretta",
      date: "2/16/2025",
      eventId: 3,
      oponent: "lbernardinelli2",
      localTeam: "lswadden2",
      hour: "12:00",
      winner: "lcabel2",
      remark:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.",
      pointResultsLocal: 3,
      pointResultsOponent: 3,
      location: "6385",
    },
    {
      id: 4,
      name: "Fulton",
      date: "9/12/2024",
      eventId: 4,
      oponent: "fkillingworth3",
      localTeam: "fpettegre3",
      hour: "11:15",
      winner: "folliver3",
      remark: "Proin risus.",
      pointResultsLocal: 4,
      pointResultsOponent: 4,
      location: "1",
    },
    {
      id: 5,
      name: "Archibald",
      date: "3/12/2025",
      eventId: 5,
      oponent: "apeirce4",
      localTeam: "agumby4",
      hour: "16:00",
      winner: "arimmington4",
      remark:
        "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
      pointResultsLocal: 5,
      pointResultsOponent: 5,
      location: "6226",
    },
    {
      id: 6,
      name: "Geraldine",
      date: "9/30/2024",
      eventId: 6,
      oponent: "gadamou5",
      localTeam: "geverard5",
      hour: "18:45",
      winner: "gromanin5",
      remark:
        "Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.",
      pointResultsLocal: 6,
      pointResultsOponent: 6,
      location: "14",
    },
    {
      id: 7,
      name: "Belita",
      date: "4/14/2025",
      eventId: 7,
      oponent: "bmachen6",
      localTeam: "bcourtliff6",
      hour: "16:30",
      winner: "bparkinson6",
      remark:
        "Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti.",
      pointResultsLocal: 7,
      pointResultsOponent: 7,
      location: "09",
    },
    {
      id: 8,
      name: "Gretel",
      date: "8/24/2024",
      eventId: 8,
      oponent: "gbillows7",
      localTeam: "galishoner7",
      hour: "15:30",
      winner: "gegleofgermany7",
      remark:
        "Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.",
      pointResultsLocal: 8,
      pointResultsOponent: 8,
      location: "526",
    },
    {
      id: 9,
      name: "Eran",
      date: "3/2/2025",
      eventId: 9,
      oponent: "estaniforth8",
      localTeam: "ecudiff8",
      hour: "19:00",
      winner: "ejone8",
      remark:
        "Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor.",
      pointResultsLocal: 9,
      pointResultsOponent: 9,
      location: "566",
    },
    {
      id: 10,
      name: "Silvester",
      date: "10/8/2024",
      eventId: 10,
      oponent: "slochran9",
      localTeam: "sgeekin9",
      hour: "09:00",
      winner: "sscatchar9",
      remark:
        "Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.",
      pointResultsLocal: 10,
      pointResultsOponent: 10,
      location: "8",
    },
  ];

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Ubicacion</TableHead>
          <TableHead>Torneo</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Puntos Local</TableHead>
          <TableHead>Visitante</TableHead>
          <TableHead>Puntos Visitante</TableHead>
          <TableHead>Ganador</TableHead>
          <TableHead>Observaciones</TableHead>

          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.date}</TableCell>
            <TableCell>{data.hour}</TableCell>
            <TableCell>{data.location}</TableCell>
            <TableCell>{data.eventId}</TableCell>
            <TableCell>{data.localTeam}</TableCell>
            <TableCell>{data.pointResultsLocal}</TableCell>
            <TableCell>{data.pointResultsOponent}</TableCell>
            <TableCell>{data.winner}</TableCell>
            <TableCell>{data.remark}</TableCell>
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
