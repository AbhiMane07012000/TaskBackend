/*
  Warnings:

  - You are about to drop the `Project_User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project_User" DROP CONSTRAINT "Project_User_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project_User" DROP CONSTRAINT "Project_User_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task_User" DROP CONSTRAINT "Task_User_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task_User" DROP CONSTRAINT "Task_User_userId_fkey";

-- DropTable
DROP TABLE "Project_User";

-- DropTable
DROP TABLE "Task_User";

-- CreateTable
CREATE TABLE "ProjectUser" (
    "projectId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProjectUser_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateTable
CREATE TABLE "TaskUser" (
    "taskId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskUser_pkey" PRIMARY KEY ("taskId","userId")
);

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUser" ADD CONSTRAINT "TaskUser_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUser" ADD CONSTRAINT "TaskUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
