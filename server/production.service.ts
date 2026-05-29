import { pool } from './postgres';

export class ProductionService {
  /**
   * Records a grain intake and creates a pending payment transaction.
   * Uses a database transaction to ensure atomicity.
   */
  static async recordGrainIntake(data: {
    weight: number;
    nrc: string;
    farmerName: string;
    crop: string;
    farmerId?: string;
  }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const pricePerKg = data.crop?.toLowerCase().includes('maize') ? 5.6 : 8.0;
      const amount = Math.round(data.weight * pricePerKg);
      const timestamp = new Date().toISOString();
      const deliveryId = `D-REC-${Date.now()}`;
      const transactionId = `TX-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      // Find farmer_id by NRC if not provided
      let actualFarmerId = data.farmerId;
      if (!actualFarmerId && data.nrc) {
        const farmerRes = await client.query('SELECT farmer_id FROM farmers WHERE nrc = $1 LIMIT 1', [data.nrc]);
        if (farmerRes.rows.length > 0) {
          actualFarmerId = farmerRes.rows[0].farmer_id;
        }
      }
      const finalFarmerId = actualFarmerId || 'UNKNOWN';

      // 1. Record the delivery
      await client.query(
        `INSERT INTO delivery_records (delivery_id, farmer_id, crop_type, weight, recorded_at) 
         VALUES ($1, $2, $3, $4, $5)`,
        [deliveryId, finalFarmerId, data.crop, data.weight, timestamp]
      );

      // 2. Create the pending payment record
      const paymentQuery = `
        INSERT INTO transactions (transaction_id, user_id, amount, payment_method, status, reference, description, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const paymentValues = [
        transactionId,
        'ADMIN-1',
        amount,
        'Mobile Money',
        'PENDING',
        `PAY-${Date.now()}`,
        `Automated payment for ${data.farmerName} (${data.crop})`,
        timestamp,
      ];

      const paymentResult = await client.query(paymentQuery, paymentValues);

      await client.query('COMMIT');

      return {
        success: true,
        payment: paymentResult.rows[0],
        bags: Math.ceil(data.weight / 50)
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}