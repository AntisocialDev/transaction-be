var express = require('express');
var router = express.Router();
const Transaction = require('../model/transactions')


router.get('/', async function (req, res, next) {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;


        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const transactions = await Transaction.find({
            date: {$gte: new Date(startDate).toISOString(), $lte: new Date(endDate).toISOString()}
        }).sort({ date: 1 }).where('status').in(['COMPLETED', 'IN PROGRESS', 'REJECTED']);

        if (transactions.length > 0) {
            res.json({
                data: transactions
            });
        } else {
            res.status(404).json({ message: 'No transactions found' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred', error: e.message });
    }
});


router.patch('/:id', async function (req, res, next) {
    try {
        const transaction = await Transaction.find({ id: req.params.id });
        if (!transaction) {
            res.status(404).send('Error retrieving Transaction. ID not found')
        }

        let query = req.body;

        const updatedTransaction = await Transaction.updateOne({ id: req.params.id }, query, { runValidators: true });
        res.json({
            data: updatedTransaction
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred', error: e.message });
    }
})

module.exports = router;