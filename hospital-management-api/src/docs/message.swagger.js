/**
 * @openapi
 * components:
 *   schemas:
 *     MessageInput:
 *       type: object
 *       required:
 *         - fromUserId
 *         - toUserId
 *         - message
 *       properties:
 *         fromUserId:
 *           type: integer
 *           example: 1
 *         toUserId:
 *           type: integer
 *           example: 2
 *         message:
 *           type: string
 *           example: Please confirm the patient appointment.
 *
 *     MessageUpdate:
 *       type: object
 *       properties:
 *         fromUserId:
 *           type: integer
 *           example: 1
 *         toUserId:
 *           type: integer
 *           example: 3
 *         message:
 *           type: string
 *           example: The appointment has been rescheduled.
 *
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid access token.
 *     NotFound:
 *       description: Requested message was not found.
 */

/**
 * @openapi
 * /api/user/message:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Create a message
 *     description: Creates a message using sender and receiver IDs from the request body.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageInput'
 *     responses:
 *       '201':
 *         description: Message created successfully.
 *       '400':
 *         description: Invalid request or user IDs.
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get all active messages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Messages fetched successfully.
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /api/user/message/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: Message ID
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get a message by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Message fetched successfully.
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *
 *   put:
 *     tags:
 *       - Messages
 *     summary: Update a message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageUpdate'
 *     responses:
 *       '200':
 *         description: Message updated successfully.
 *       '400':
 *         description: Invalid request.
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Soft-delete a message
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Message marked inactive.
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */

export { };