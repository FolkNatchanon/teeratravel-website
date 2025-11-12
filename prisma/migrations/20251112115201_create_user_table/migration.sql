-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(30) NOT NULL,
    `user_fname` VARCHAR(30) NOT NULL,
    `user_lname` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `role` CHAR(1) NOT NULL,
    `password` CHAR(20) NOT NULL,
    `phone_number` CHAR(10) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
