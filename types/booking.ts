
/* export interface userIdBookingId{
  name:string;
  uid:string;
}
export interface fieldIdBoookingId{
  _id:string;
  neme:string;
  location:string;
  pricePerHour:number;
}
	
 */

/* export interface BookingIdResponse {
  _id:string;
  userId:userIdBookingId;
  fieldId:fieldIdBoookingId;
  startTime: Date;
  durationInMinutes: number;
  endTime:Date;
  totalPrice: number;
  state: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
 */

export interface BookingIdResponse {
  _id: string;
  userId: { name: string; uid: string };
  fieldId: { _id: string; name: string; location: string; pricePerHour: number };
  startTime: string; // Viene como string ISO de la API
  durationInMinutes: number;
  endTime: string;
  totalPrice: number;
  state: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  businessId: string;
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



//bookins
export interface BookingType {
  _id: string;
  userId: { name: string; email: string };
  fieldId: { name: string; location: string };
  businessId: { slug: string; name: string; id: string; };
  startTime: string;
  endTime: string;
  durationInMinutes: number;
  totalPrice: number;
  state: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  customerName: string;
  customerDNI: string;
  createdAt: string;
}


// types/booking.ts
//export type PaymentMethod = ['YAPE' , 'CASH' , 'CREDIT_CARD'];



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
  phonePayment?: string;
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



// response reservas por campo

export interface userIdBookingsByField {
  _id: string;
  name: string;
  email: string;
  phone: string;

}
export interface fieldIdBoookingByField {
  _id: string;
  neme: string;
  location: string;
}

export interface dataBookisByField {
  _id: string;
  userId: userIdBookingsByField;
  fieldId: fieldIdBoookingByField;
  startTime: Date;
  durationInMinutes: number;
  endTime: Date;
  totalPrice: number;
  state: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;

}

export interface metadataBookingByField {
  requestedDate: Date;
  fieldId: string;
  businessId: string;
}

export interface bookingsByFieldResponse {
  status: string;
  results: number;
  metadata: bookingsByFieldResponse;
  data: dataBookisByField;
}


