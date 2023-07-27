-- DropForeignKey
ALTER TABLE "subtasks" DROP CONSTRAINT "subtasks_id_fkey";

-- AlterTable
ALTER TABLE "subtasks" ADD COLUMN     "taskId" INTEGER;

-- AddForeignKey
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
