
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


//BokingFrom azul
/* export interface BookingFormInput {
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
 */

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
//export type PaymentMethod = ['YAPE' , 'CASH' , 'CREDIT_CARD'];

/* //BokingFrom azul
export interface BookingFormInput {
  fieldId: string;
  idUser: string;
  startTime: string; // ISO String
  durationInMinutes: number;
  paymentMethod: PaymentMethod;
  amout: Number;
  descuento?: number;
  total: number;
  idCustomer?: string;
  dniCustomer?: string;
  nameCustomer?: string;
}

 */

// Nota: 'number' en minúscula siempre
export interface BookingFormInput {
  fieldId: string;
  idUser: string;
  startTime: string; 
  durationInMinutes: number;
  paymentMethod: string; // O el Enum que uses
  amount: number;        // Corregido: 'amount' con 'n'
  descuento: number;
  total: number;
  idCustomer?: string;
  dniCustomer?: string;
  nameCustomer?: string;
}


//create bookings method
export interface bookingRequest {
  userId: string;
  fieldId: string;
  starTime: Date;
  durationInMinutes: number;
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

