"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useMajors } from "@/hooks/majors/use-major";

export default function Carreras() {
    const { data: majors, isLoading } = useMajors();

    return (
        <Table>
            <TableCaption>Lista de Carreras disponibles.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Nombre</TableHead>

                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading &&
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell colSpan={3}>
                                <Skeleton className="w-full h-10" />
                            </TableCell>
                        </TableRow>
                    ))
                }

                {majors?.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-blue-100 hover:bg-blue-200"
                                >
                                    <HammerIcon size={18} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-red-100 hover:bg-red-200"
                                >
                                    <Trash2Icon size={18} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}