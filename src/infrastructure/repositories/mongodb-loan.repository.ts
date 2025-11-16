import { ObjectId } from "mongodb"
import type { LoanRepository } from "@/domain/repositories/loan.repository"
import type { Loan, CreateLoanInput } from "@/domain/entities/loan.entity"
import { getDatabase } from "../database/mongodb"

export class MongoDBLoanRepository implements LoanRepository {
  private collectionName = "loans"

  async create(input: CreateLoanInput): Promise<Loan> {
    const db = await getDatabase()
    const now = new Date()
    const loanDoc = {
      ...input,
      loanDate: now,
      status: "ACTIVE" as const,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(this.collectionName).insertOne(loanDoc)

    return {
      id: result.insertedId.toString(),
      ...loanDoc,
    }
  }

  async findById(id: string): Promise<Loan | null> {
    const db = await getDatabase()
    const loan = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!loan) return null

    return {
      id: loan._id.toString(),
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      status: loan.status,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const db = await getDatabase()
    const loans = await db.collection(this.collectionName).find({ userId }).toArray()

    return loans.map((loan) => ({
      id: loan._id.toString(),
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      status: loan.status,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }))
  }

  async findByBookId(bookId: string): Promise<Loan[]> {
    const db = await getDatabase()
    const loans = await db.collection(this.collectionName).find({ bookId }).toArray()

    return loans.map((loan) => ({
      id: loan._id.toString(),
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      status: loan.status,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }))
  }

  async findAll(): Promise<Loan[]> {
    const db = await getDatabase()
    const loans = await db.collection(this.collectionName).find({}).toArray()

    return loans.map((loan) => ({
      id: loan._id.toString(),
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      status: loan.status,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }))
  }

  async returnLoan(id: string): Promise<Loan> {
    const db = await getDatabase()
    await db.collection(this.collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          returnDate: new Date(),
          status: "RETURNED",
          updatedAt: new Date(),
        },
      },
    )

    const loan = await this.findById(id)
    if (!loan) throw new Error("Loan not found after return")

    return loan
  }

  async updateStatus(id: string, status: "ACTIVE" | "RETURNED" | "OVERDUE"): Promise<void> {
    const db = await getDatabase()
    await db
      .collection(this.collectionName)
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })
  }
}
