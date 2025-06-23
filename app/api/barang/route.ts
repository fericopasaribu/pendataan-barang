import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

// Prisma
const prisma = new PrismaClient();

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    let keyword = searchParams.get("search") || "";

    // Hilangkan spasi dan ubah ke huruf kecil
    keyword = keyword.replace(/\s+/g, "").toLowerCase();

    // Ambil semua barang
    const allItems = await prisma.tb_barang.findMany();

    // Filter manual: cocokkan kode/nama/harga tanpa spasi
    const filtered = allItems.filter((item) => {
        const kode = item.kode?.replace(/\s+/g, "").toLowerCase() || "";
        const nama = item.nama?.replace(/\s+/g, "").toLowerCase() || "";
        const harga = String(item.harga ?? "").replace(/\s+/g, "").toLowerCase();

        return (
            kode.includes(keyword) ||
            nama.includes(keyword) ||
            harga.includes(keyword)
        );
    });

    return NextResponse.json(
        {
            meta_data: {
                success: true,
                message: "",
                status: 200
            },
            result: filtered,
        },
        { status: 200 }
    );
};

export const POST = async (request: NextRequest) => {

    const formData = await request.formData()

    const checkData = await prisma.tb_barang.findMany({
        where: {
            kode: formData.get("kode")?.toString(),
        }
    })

    if (checkData.length == 1) {

        return NextResponse.json({
            meta_data: {
                success: false,
                message: "Data Barang Gagal Disimpan. Kode Barang Sudah Digunakan !",
                status: 409
            },
            // result: null,
        },
            { status: 409 })
    }

    // simpan data
    await prisma.tb_barang.create({
        data: {
            kode: formData.get("kode")?.toString() || "",
            nama: formData.get("nama")?.toString() || "",
            harga: Number(formData.get("harga")?.toString() || ""),
            foto: formData.get("foto")?.toString() || "",
        }
    })

    return NextResponse.json({
        meta_data: {
            success: true,
            message: "Data Barang Berhasil Disimpan",
            status: 201
        },
        // result: save,
    },
        { status: 201 })

}

export const DELETE = async () => {
    return NextResponse.json({
        meta_data: {
            success: false,
            message: "Parameter Slug Harus Diisi !",
            status: 400,
        },
    }, { status: 400 });
}

export const PUT = async () => {
    return NextResponse.json({
        meta_data: {
            success: false,
            message: "Parameter Slug Harus Diisi !",
            status: 400,
        },
    }, { status: 400 });
}

// export const DELETE = async (request: NextRequest) => {

//     const formData = await request.formData()

//     const getData = await prisma.tb_barang.findMany({
//         where: {
//             kode: formData.get("kode")?.toString() || "",
//         }
//     })

//     if (getData.length != 1) {

//         return NextResponse.json({
//             meta_data: {
//                 success: false,
//                 message: "Data Barang Gagal Dihapus. Kode Barang Tidak Ditemukan !",
//                 status: 404
//             }
//         },
//             {
//                 status: 404
//             })
//     }

//     await prisma.tb_barang.deleteMany({
//         where: {
//             kode: formData.get("kode")?.toString() || "",
//         },
//     });

//     return NextResponse.json(
//         {
//             meta_data: {
//                 success: true,
//                 message: "Data Barang Berhasil Dihapus !",
//                 status: 200
//             }
//         },
//         {
//             status: 200
//         }
//     );

// }
