/*
  Warnings:

  - You are about to drop the column `emergency_contact` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `food` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `passenger` table. All the data in the column will be lost.
  - Made the column `age` on table `passenger` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `passenger` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `passenger` DROP FOREIGN KEY `passenger_booking_id_fkey`;

-- DropIndex
DROP INDEX `passenger_booking_id_fkey` ON `passenger`;

-- AlterTable
ALTER TABLE `passenger` DROP COLUMN `emergency_contact`,
    DROP COLUMN `food`,
    DROP COLUMN `note`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `fname` VARCHAR(191) NOT NULL,
    MODIFY `lname` VARCHAR(191) NOT NULL,
    MODIFY `age` INTEGER NOT NULL,
    MODIFY `gender` ENUM('M', 'F', 'Other') NOT NULL;

-- AddForeignKey
ALTER TABLE `passenger` ADD CONSTRAINT `passenger_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;
