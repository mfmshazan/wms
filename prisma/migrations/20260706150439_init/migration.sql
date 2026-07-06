-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERATOR', 'QUALITY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "movementId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "performedBy" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sku" TEXT NOT NULL,
    "productName" TEXT NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" SERIAL NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "inspector" TEXT NOT NULL,
    "overallResult" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sku" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "movementRef" TEXT,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criterion" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "inspectionId" INTEGER NOT NULL,

    CONSTRAINT "Criterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defect" (
    "id" SERIAL NOT NULL,
    "defectId" TEXT NOT NULL,
    "criterionLabel" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "disposition" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "rootCause" TEXT,
    "reportedBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "sku" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "inspectionRef" TEXT,

    CONSTRAINT "Defect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NCR" (
    "id" SERIAL NOT NULL,
    "ncrId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "immediateAction" TEXT,
    "raisedBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "targetDate" TEXT,
    "closedAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "defectSku" TEXT,
    "productName" TEXT,
    "defectRef" TEXT,

    CONSTRAINT "NCR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CAPA" (
    "id" SERIAL NOT NULL,
    "capaId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "description" TEXT NOT NULL,
    "assignedTo" TEXT,
    "targetDate" TEXT,
    "completedAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "effectiveness" TEXT NOT NULL DEFAULT 'Pending',
    "ncrId" INTEGER NOT NULL,

    CONSTRAINT "CAPA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_movementId_key" ON "Movement"("movementId");

-- CreateIndex
CREATE INDEX "Movement_sku_idx" ON "Movement"("sku");

-- CreateIndex
CREATE INDEX "Movement_type_idx" ON "Movement"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Inspection_inspectionId_key" ON "Inspection"("inspectionId");

-- CreateIndex
CREATE INDEX "Inspection_sku_idx" ON "Inspection"("sku");

-- CreateIndex
CREATE INDEX "Inspection_overallResult_idx" ON "Inspection"("overallResult");

-- CreateIndex
CREATE INDEX "Criterion_inspectionId_idx" ON "Criterion"("inspectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Defect_defectId_key" ON "Defect"("defectId");

-- CreateIndex
CREATE INDEX "Defect_sku_idx" ON "Defect"("sku");

-- CreateIndex
CREATE INDEX "Defect_status_idx" ON "Defect"("status");

-- CreateIndex
CREATE INDEX "Defect_severity_idx" ON "Defect"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "NCR_ncrId_key" ON "NCR"("ncrId");

-- CreateIndex
CREATE INDEX "NCR_status_idx" ON "NCR"("status");

-- CreateIndex
CREATE INDEX "NCR_priority_idx" ON "NCR"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "CAPA_capaId_key" ON "CAPA"("capaId");

-- CreateIndex
CREATE INDEX "CAPA_ncrId_idx" ON "CAPA"("ncrId");

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_movementRef_fkey" FOREIGN KEY ("movementRef") REFERENCES "Movement"("movementId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterion" ADD CONSTRAINT "Criterion_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_sku_fkey" FOREIGN KEY ("sku") REFERENCES "Product"("sku") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_inspectionRef_fkey" FOREIGN KEY ("inspectionRef") REFERENCES "Inspection"("inspectionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NCR" ADD CONSTRAINT "NCR_defectRef_fkey" FOREIGN KEY ("defectRef") REFERENCES "Defect"("defectId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAPA" ADD CONSTRAINT "CAPA_ncrId_fkey" FOREIGN KEY ("ncrId") REFERENCES "NCR"("id") ON DELETE CASCADE ON UPDATE CASCADE;
