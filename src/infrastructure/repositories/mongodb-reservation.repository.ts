import { ObjectId } from "mongodb"
import type { ReservationRepository } from "@/domain/repositories/reservation.repository"
import type { Reservation, CreateReservationInput } from "@/domain/entities/reservation.entity"
import { getDatabase } from "../database/mongodb"

export class MongoDBReservationRepository implements ReservationRepository {
  private collectionName = "reservations"

  async create(input: CreateReservationInput): Promise<Reservation> {
    const db = await getDatabase()
    const now = new Date()
    const expiryDate = new Date(now)
    expiryDate.setDate(expiryDate.getDate() + 7) // 7 days to pick up

    const reservationDoc = {
      ...input,
      reservationDate: now,
      expiryDate,
      status: "PENDING" as const,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection(this.collectionName).insertOne(reservationDoc)

    return {
      id: result.insertedId.toString(),
      ...reservationDoc,
    }
  }

  async findById(id: string): Promise<Reservation | null> {
    const db = await getDatabase()
    const reservation = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) })

    if (!reservation) return null

    return {
      id: reservation._id.toString(),
      bookId: reservation.bookId,
      userId: reservation.userId,
      reservationDate: reservation.reservationDate,
      expiryDate: reservation.expiryDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const db = await getDatabase()
    const reservations = await db.collection(this.collectionName).find({ userId }).toArray()

    return reservations.map((reservation) => ({
      id: reservation._id.toString(),
      bookId: reservation.bookId,
      userId: reservation.userId,
      reservationDate: reservation.reservationDate,
      expiryDate: reservation.expiryDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }))
  }

  async findByBookId(bookId: string): Promise<Reservation[]> {
    const db = await getDatabase()
    const reservations = await db.collection(this.collectionName).find({ bookId }).toArray()

    return reservations.map((reservation) => ({
      id: reservation._id.toString(),
      bookId: reservation.bookId,
      userId: reservation.userId,
      reservationDate: reservation.reservationDate,
      expiryDate: reservation.expiryDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }))
  }

  async findAll(): Promise<Reservation[]> {
    const db = await getDatabase()
    const reservations = await db.collection(this.collectionName).find({}).toArray()

    return reservations.map((reservation) => ({
      id: reservation._id.toString(),
      bookId: reservation.bookId,
      userId: reservation.userId,
      reservationDate: reservation.reservationDate,
      expiryDate: reservation.expiryDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }))
  }

  async cancel(id: string): Promise<void> {
    const db = await getDatabase()
    await db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "CANCELLED", updatedAt: new Date() } }
      )
  }

  async fulfill(id: string): Promise<void> {
    const db = await getDatabase()
    await db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "FULFILLED", updatedAt: new Date() } }
      )
  }
}
