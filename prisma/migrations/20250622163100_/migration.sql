-- CreateTable
CREATE TABLE "tb_barang" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(20) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "harga" INTEGER NOT NULL,
    "foto" VARCHAR(50) NOT NULL,

    CONSTRAINT "tb_barang_pkey" PRIMARY KEY ("id")
);
