-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contractRef" TEXT NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "sdgRate" INTEGER NOT NULL DEFAULT 2600,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "organizationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Approver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "roleAr" TEXT NOT NULL,
    "maxApprovalUsd" INTEGER,
    CONSTRAINT "Approver_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "badgeAr" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "bags" INTEGER NOT NULL,
    "gear" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "dailyRateUsd" INTEGER NOT NULL,
    "incEn" TEXT NOT NULL,
    "incAr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "busyUntil" DATETIME,
    CONSTRAINT "VehicleUnit_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "subEn" TEXT NOT NULL,
    "subAr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "subEn" TEXT NOT NULL,
    "subAr" TEXT NOT NULL,
    "priceUsd" INTEGER NOT NULL,
    "unit" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PayMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "subEn" TEXT NOT NULL,
    "subAr" TEXT NOT NULL,
    "orgOnly" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ref" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "unitId" TEXT,
    "pickupDate" DATETIME NOT NULL,
    "returnDate" DATETIME NOT NULL,
    "locationId" INTEGER NOT NULL,
    "driver" BOOLEAN NOT NULL,
    "addonsJson" TEXT NOT NULL,
    "orgName" TEXT,
    "costCentre" TEXT,
    "poRef" TEXT,
    "payMethod" TEXT NOT NULL,
    "needsApproval" BOOLEAN NOT NULL,
    "approverId" TEXT,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "costTotalUsd" INTEGER NOT NULL,
    "depositUsd" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "VehicleUnit" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "bookingRef" TEXT,
    "organizationId" TEXT,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "amountUsd" INTEGER,
    "status" TEXT NOT NULL,
    CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RefCounter" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'booking_ref',
    "value" INTEGER NOT NULL DEFAULT 444
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleUnit_plate_key" ON "VehicleUnit"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ref_key" ON "Booking"("ref");

-- CreateIndex
CREATE INDEX "OtpCode_phone_idx" ON "OtpCode"("phone");
