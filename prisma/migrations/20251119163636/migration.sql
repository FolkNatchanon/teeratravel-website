/*
  Warnings:

  - Added the required column `category` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package` ADD COLUMN `base_member_count` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `boat_id` INTEGER NULL,
    ADD COLUMN `category` ENUM('FULL_TALU', 'SHORT_TALU', 'FULL_REMOTE', 'JOIN_GROUP') NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `duration_minutes` INTEGER NULL,
    ADD COLUMN `extra_price_per_person` DECIMAL(10, 2) NULL,
    ADD COLUMN `includes_left` TEXT NULL,
    ADD COLUMN `includes_right` TEXT NULL,
    ADD COLUMN `main_location` VARCHAR(120) NULL,
    ADD COLUMN `max_participants` INTEGER NULL,
    ADD COLUMN `spot_count` INTEGER NULL,
    ADD COLUMN `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    ADD COLUMN `type` ENUM('PRIVATE', 'JOIN') NOT NULL DEFAULT 'PRIVATE',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Boat` (
    `boat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `code` VARCHAR(30) NULL,
    `type` VARCHAR(30) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`boat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `Boat`(`boat_id`) ON DELETE SET NULL ON UPDATE CASCADE;
