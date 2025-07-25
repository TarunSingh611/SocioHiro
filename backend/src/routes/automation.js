const express = require('express');
const router = express.Router();

// Development-only mock data routes (no auth required)
if (process.env.NODE_ENV === 'development') {
  router.get('/', (req, res) => {
    const mockAutomations = Array.from({ length: 4 }, (_, i) => ({
      _id: `automation_${i + 1}`,
      name: `Auto Response ${i + 1}`,
      description: `Automated response rule for ${i + 1}`,
      isActive: Math.random() > 0.5,
      trigger: ["Comment", "DM", "Mention"][Math.floor(Math.random() * 3)],
      action: ["Send DM", "Like", "Follow"][Math.floor(Math.random() * 3)],
      keywords: ["product", "price", "info"],
      responseMessage: `Thank you for your interest! Here's more information about our products.`,
      executions: Math.floor(Math.random() * 100) + 10,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    res.json(mockAutomations);
  });

  router.post('/', (req, res) => {
    const newAutomation = {
      _id: `automation_${Date.now()}`,
      ...req.body,
      isActive: true,
      executions: 0,
      createdAt: new Date().toISOString()
    };
    res.status(201).json(newAutomation);
  });

  router.put('/:id', (req, res) => {
    const updatedAutomation = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    res.json(updatedAutomation);
  });

  router.delete('/:id', (req, res) => {
    res.json({ message: 'Automation deleted successfully' });
  });
} else {
  // TODO: Add authentication middleware and automation endpoints for production
  router.get('/', (req, res) => {
    res.json({ message: 'Automation route placeholder' });
  });
}

module.exports = router; 