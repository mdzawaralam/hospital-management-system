/*
  Warnings:

  - A unique constraint covering the columns `[slotTime]` on the table `Slots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Slots_slotTime_key" ON "Slots"("slotTime");
