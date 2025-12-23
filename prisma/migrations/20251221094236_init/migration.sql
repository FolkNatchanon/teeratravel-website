-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `user_fname` VARCHAR(30) NOT NULL,
    `user_lname` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `role` CHAR(1) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone_number` CHAR(10) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Boat` (
    `boat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Boat_is_active_idx`(`is_active`),
    PRIMARY KEY (`boat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `package_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `boat_id` INTEGER NULL,
    `type` ENUM('private', 'join') NOT NULL DEFAULT 'private',
    `time` INTEGER NULL,
    `spot_count` INTEGER NULL,
    `base_member_count` INTEGER NOT NULL DEFAULT 10,
    `extra_price_per_person` DECIMAL(10, 2) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Package_boat_id_idx`(`boat_id`),
    INDEX `Package_status_idx`(`status`),
    INDEX `Package_type_idx`(`type`),
    PRIMARY KEY (`package_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageTimeSlot` (
    `timeslot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `slot` ENUM('morning', 'afternoon') NOT NULL,
    `max_capacity` INTEGER NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PackageTimeSlot_package_id_idx`(`package_id`),
    INDEX `PackageTimeSlot_status_idx`(`status`),
    UNIQUE INDEX `PackageTimeSlot_package_id_slot_key`(`package_id`, `slot`),
    PRIMARY KEY (`timeslot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `booking_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,
    `timeslot_id` INTEGER NOT NULL,
    `trip_date` DATETIME(3) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'complete', 'cancel') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `booking_user_id_idx`(`user_id`),
    INDEX `booking_package_id_idx`(`package_id`),
    INDEX `booking_timeslot_id_idx`(`timeslot_id`),
    INDEX `booking_trip_date_idx`(`trip_date`),
    INDEX `booking_status_idx`(`status`),
    INDEX `booking_package_id_trip_date_timeslot_id_idx`(`package_id`, `trip_date`, `timeslot_id`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passenger` (
    `passenger_id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `fname` VARCHAR(60) NOT NULL,
    `lname` VARCHAR(60) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `passenger_booking_id_idx`(`booking_id`),
    PRIMARY KEY (`passenger_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `Boat`(`boat_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageTimeSlot` ADD CONSTRAINT `PackageTimeSlot_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `Package`(`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_timeslot_id_fkey` FOREIGN KEY (`timeslot_id`) REFERENCES `PackageTimeSlot`(`timeslot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passenger` ADD CONSTRAINT `passenger_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `booking`(`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;
