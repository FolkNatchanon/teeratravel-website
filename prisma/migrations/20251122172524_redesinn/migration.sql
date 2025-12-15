-- AlterTable
ALTER TABLE `boat` ADD COLUMN `extra_private_price` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `join_trip_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `join_trip` (
    `join_trip_id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `boat_id` INTEGER NOT NULL,
    `trip_date` DATETIME(3) NOT NULL,
    `time_slot` VARCHAR(50) NOT NULL,
    `price_per_person` DECIMAL(10, 2) NOT NULL,
    `max_seats` INTEGER NOT NULL,
    `status` ENUM('draft', 'open', 'closed', 'cancelled') NOT NULL DEFAULT 'open',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`join_trip_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `join_trip` ADD CONSTRAINT `join_trip_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `join_trip` ADD CONSTRAINT `join_trip_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `Boat`(`boat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_join_trip_id_fkey` FOREIGN KEY (`join_trip_id`) REFERENCES `join_trip`(`join_trip_id`) ON DELETE SET NULL ON UPDATE CASCADE;
