-- CreateTable
CREATE TABLE "support_chat_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userMessage" TEXT NOT NULL,
    "botReply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_chat_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_chat_logs" ADD CONSTRAINT "support_chat_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
