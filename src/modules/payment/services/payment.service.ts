import { injectable } from 'tsyringe';

@injectable()
export class PaymentService {
  processPayment(amount: number, method: string): boolean {
    if (amount <= 0) {
      return false;
    }

    if (!method || method.trim().length === 0) {
      return false;
    }

    // Simula processamento de pagamento
    const result = this.validatePaymentMethod(method);
    
    if (!result) {
      return false;
    }

    // Simula chamada a API de pagamento
    return this.callPaymentGateway(amount, method);
  }

  private validatePaymentMethod(method: string): boolean {
    const validMethods = ['credit_card', 'debit_card', 'pix', 'bank_transfer'];
    return validMethods.includes(method);
  }

  private callPaymentGateway(amount: number, method: string): boolean {
    // Simula resposta da API
    return true;
  }

  refundPayment(transactionId: string): boolean {
    if (!transactionId) {
      return false;
    }

    return this.processRefund(transactionId);
  }

  private processRefund(transactionId: string): boolean {
    // Simula processamento de reembolso
    return true;
  }
}
