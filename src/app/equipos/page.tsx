'use client'
import * as z from "zod/v4";
import ky from "ky";
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
import { useQuery } from "@tanstack/react-query";
import { HammerIcon, Trash2Icon, CheckIcon, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Equipos() {

  const {data, isLoading} = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const teamsSchema = z.array(
        z.object({
          ID: z.number(),
          Nombre: z.string(),
          DisciplinaID: z.number(),
          UniversidadID: z.number(),
          Categoria: z.string(),
          Regular: z.boolean(),
        })
      );

      const resSchema = z.object({
        data: teamsSchema,
        message: z.string(),
      });

      const res = await ky.get("http://localhost:8080/teams/").json();
      const parsed = resSchema.parse(res);

      return parsed.data;
  }});


  const teams = [
    {
      id: 1,
      name: "Brandtr",
      discipline: "Regen",
      regular: false,
      university: "Jacky",
      category: "Toys",
    },
    {
      id: 2,
      name: "Retha",
      discipline: "Cassy",
      regular: true,
      university: "Lizzie",
      category: "Kitchen",
    },
    {
      id: 3,
      name: "Weylin",
      discipline: "Josefa",
      regular: true,
      university: "Oliy",
      category: "Food - Snacks",
    },
    {
      id: 4,
      name: "Teena",
      discipline: "Stephan",
      regular: false,
      university: "Natale",
      category: "Accessories",
    },
    {
      id: 5,
      name: "Augustine",
      discipline: "Dyanna",
      regular: false,
      university: "Herculie",
      category: "Accessories",
    },
    {
      id: 6,
      name: "Bruno",
      discipline: "Loydie",
      regular: true,
      university: "Myer",
      category: "Food - Frozen Food",
    },
    {
      id: 7,
      name: "Lenna",
      discipline: "Robby",
      regular: true,
      university: "Teddie",
      category: "Food - Frozen Foods",
    },
    {
      id: 8,
      name: "Morie",
      discipline: "Davina",
      regular: false,
      university: "Lizabeth",
      category: "Food - Dressings",
    },
    {
      id: 9,
      name: "Julius",
      discipline: "Gusty",
      regular: false,
      university: "Tova",
      category: "Kitchen",
    },
    {
      id: 10,
      name: "Susanne",
      discipline: "Casie",
      regular: false,
      university: "Ban",
      category: "Fitness",
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
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <Skeleton className="w-full h-10"></Skeleton>
                </TableCell>
              </TableRow>
            ))
          : null}
        {data ?
        data.map((data) => (
          <TableRow key={data.ID}>
            <TableCell>{data.Nombre}</TableCell>
            <TableCell>{data.DisciplinaID}</TableCell>
            <TableCell>{data.UniversidadID}</TableCell>
            <TableCell>{data.Categoria}</TableCell>
            <TableCell>{data.Regular ? <CheckIcon /> : <X />}</TableCell>
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
        ))
      : null}
      </TableBody>
    </Table>
  );
}
