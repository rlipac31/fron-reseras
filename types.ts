

"6985fd2775586eb5bb1b75d4"
// cliente
export interface UserType {
  uid: string;
  name: string;
  email: string;
  dni: string;
  phone: string;
  role: 'ADMIN' | 'USER' | 'CUSTOMER';
  state: boolean;
  createdAt: string;
}
//bookins

export interface Booking {
  _id: string;
  userId: { name: string };
  fieldId: { name: string; location: string };
  businessId: { slug: string; name: string; id: string; };
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  totalPrice: number;
  state: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}


// types/booking.ts
export type PaymentMethod = 'YAPE' | 'CASH' | 'CREDIT_CARD';

//BokingFrom azul
export interface BookingFormInput {
  fieldId: string;
  idUser: string;
  startTime: string; // ISO String
  durationInMinutes: number;
  paymentMethod: PaymentMethod;
  amout: Number;
  descuento: Number;
  total: Number;
  idCustomer?: string;
  dniCustomer?: string;
  nameCustomer?: string;
}

//payment method
export interface PaymentDataRequest {
  bookingId?: string;
  userId: string;
  nameCustomer?: string;
  idUser: string;
  idCustomer?: string;
  dniCustomer?: string;
  amount: number;
  descuento?: number;
  total: number
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'YAPE' | 'CASH';
}



//create bookings method
export interface bookingRequest {
  userId: string;
  fieldId: string;
  starTime: Date;
  durationInMinutes: number;
}


//create user method
export interface userRequest {
  name: string;
  email: string;
  password: string;
  dni?: string;
  phone?: string;
  businessId: string;
}

// Tipos para Canchas
export interface Cancha {
  id: number;
  nombre: string;
  ubicacion: string;
  precioPorHora: number;
  imagen: string;
  horariosDisponibles: string[];
  descripcion?: string; // Opcional
  servicios?: string[]; // Ej: ["Vestidores", "Iluminación", "Parking"]
}

// Tipos para Reservas
export interface Reserva {
  id: string; // UUID o ID generado por tu backend
  canchaId: number;
  usuarioId: string; // ID del usuario que reserva
  fecha: string; // Formato YYYY-MM-DD
  horario: string; // Formato HH:MM
  precioTotal: number;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
  creadoEn: string; // ISO Date string
}

// Tipos para Usuarios (si tu API maneja autenticación)
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

// Tipos para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos para el formulario de reserva
export interface FormularioReserva {
  userId: string;
  fieldId: string;
  startTime: Date;
  durationInMinutes: number;
}

// Tipos para el dashboard de reservas (ejemplo)
export type ReservaConCancha = Reserva & {
  cancha: Cancha;
};
