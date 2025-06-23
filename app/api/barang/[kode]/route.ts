import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const DELETE = async (_: NextRequest, props: { params: Promise<{ kode: string }> }) => {
    try {
        const { kode } = await props.params;

        // cek apakah "kode" ada / tidak
        const getData = await prisma.tb_barang.findMany({
            where: { kode }
        })

        // jika "kode" tidak ditemukan
        if (getData.length != 1) {
            return NextResponse.json({
                meta_data: {
                    success: false,
                    message: "Data Barang Gagal Dihapus. Kode Barang Tidak Ditemukan !",
                    status: 404
                },
            }, {
                status: 404
            })
        }

        // hapus data
        await prisma.tb_barang.deleteMany({
            where: { kode }
        })

        // proses / response API
        return NextResponse.json({
            meta_data: {
                success: true,
                message: "Data Barang Berhasil Dihapus",
                status: 200
            },
        }, {
            status: 200
        })
    }
    catch (e: any) {
        return NextResponse.json({
            meta_data: {
                success: false,
                message: "Parameter Slug Harus Kode Barang !",
                status: 400
            },
        }, {
            status: 400
        })
    }
}

export const GET = async (_: NextRequest, props: { params: Promise<{ kode: string }> }) => {
    try {
        // const { kode } = await props.params;
        const parameter = (await props.params).kode;

        // cek apakah "kode" ada / tidak
        const getData = await prisma.tb_barang.findMany({
            where: {
                kode: parameter,
            }
        })

        // jika "kode" tidak ditemukan
        if (getData.length != 1) {
            return NextResponse.json({
                meta_data: {
                    success: false,
                    message: "Data Barang Tidak Ditemukan !",
                    status: 404
                },
            }, {
                status: 404
            })
        }

        // proses / response API
        return NextResponse.json({
            meta_data: {
                success: true,
                message: "",
                status: 200
            },
            result: getData
        }, {
            status: 200
        })

    }
    catch (e: any) {
        return NextResponse.json({
            meta_data: {
                success: false,
                message: "Parameter Slug Harus Kode Barang !",
                status: 400
            },
        }, {
            status: 400
        })
    }

}

export const PUT = async (request: NextRequest, props: { params: Promise<{ kode: string }> }) => {
    const parameter = (await props.params).kode;

    // cek apakah "kode" ada / tidak
    const getData = await prisma.tb_barang.findMany({
        where: {
            kode: parameter,
        }
    })

    // jika "kode" tidak ditemukan
    if (getData.length != 1) {
        return NextResponse.json({
            meta_data: {
                success: false,
                message: "Data Barang Tidak Ditemukan !",
                status: 404
            },
        }, {
            status: 404
        })
    }

    const formData = await request.formData()

    // cek apakah username sudah pernah ada / belum
    const checkData = await prisma.tb_barang.findMany({
        where: {
            kode: formData.get("kode")?.toString(),
            // id: {not: Number(params.id)}
            NOT: { kode: parameter }
        }
    })

    // jika "kode" ditemukan
    if (checkData.length >= 1) {
        return NextResponse.json({
            meta_data: {
                success: false,
                message: "Data Barang Gagal Diubah. Kode Barang Sudah Digunakan !",
                status: 409
            },
        },
            { status: 409 })
    }

    // ubah data
    await prisma.tb_barang.updateMany({
        where: {
            kode: parameter
        },
        data: {
            kode: formData.get("kode")?.toString() || "",
            nama: formData.get("nama")?.toString() || "",
            harga: Number(formData.get("harga")?.toString() || ""),
            foto: formData.get("foto")?.toString() || "",
        },
    })

    // proses / response API
    return NextResponse.json({
        meta_data: {
            success: true,
            message: "Data Barang Berhasil Diubah",
            status: 200
        },
    },
        { status: 200 })
}