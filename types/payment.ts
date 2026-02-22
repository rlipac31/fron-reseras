/* {
	"success": true,
	"pagination": {
		"totalResults": 103,
		"totalPages": 26,
		"currentPage": 1,
		"limit": 4
	},
	"resumenFinanciero": {
		"_id": null,
		"totalGlobal": 14255,
		"porYape": 7693,
		"porEfectivo": 6362,
		"porTarjeta": 200
	},
	"data": [
		{
			"_id": "699637360804d2e54aab0a32",
			"bookingId": "699637360804d2e54aab0a30",
			"userId": {
				"name": "ricardo",
				"email": "pino@gmail.com",
				"uid": "6984d4366a3c21cc6ee907d1"
			},]}
          */


export interface dataPaymentType {
     _id: string;
     bookingId: {
      _id:string; 
      fieldId:{_id:string; name:string; location:string;};
      startTime:string;
      endTime:string;};
     userId: {uid:string; name:string; email:string;};
     idCustomer: string;
     nameCustomer: string;
     amount: number;
     descuento: number;
     total: number;
     paymentMethod: string;
     status: string;
     businessId: {
        _id: string;
        slug: string;
     }
     paymentDate: string;
}

export interface paymentConFiltroResponse {
      status: string;
      meta: {
         totalResults: number;
         page: number;
         limit: number;
         appliedFilter: string;

      },
      data: {
      _id: string;
      bookingId: string;
      userId: string;
      idCustomer: string;
      nameCustomer: string;
      amount: number;
      descuento: number;
      total: number;
      paymentMethod: string;
      status: string;
      businessId: {
         _id: string;
         slug: string;
      }
   }
}