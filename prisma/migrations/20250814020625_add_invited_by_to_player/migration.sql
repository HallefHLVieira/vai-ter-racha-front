-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "invitedById" TEXT;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
