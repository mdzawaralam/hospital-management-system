/**
 * @openapi
 * tags:
 *   - name: Authentication
 *   - name: Qualifications
 *   - name: Doctors
 *   - name: Receptionists
 *   - name: Patients
 *   - name: Diseases
 *   - name: Specialists
 *   - name: Slots
 *   - name: Week Slots
 *   - name: Doctor Availability
 *   - name: Treatments
 *   - name: Messages
 *
 * components:
 *   schemas:
 *     GenericRequest:
 *       type: object
 *       additionalProperties: true
 *       description: Supply the fields required by the corresponding API.
 *     ApiSuccess:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           description: API response data
 *     ApiError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *
 *   parameters:
 *     RecordId:
 *       name: id
 *       in: path
 *       required: true
 *       description: Numeric record ID
 *       schema:
 *         type: integer
 *         minimum: 1
 *
 *   responses:
 *     Unauthorized:
 *       description: Authentication is missing or invalid.
 *     Forbidden:
 *       description: User does not have permission to perform this operation.
 *     NotFound:
 *       description: Requested record was not found.
 *
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in
 *     description: Authenticate a user and obtain an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Login response.
 *       '400':
 *         description: Invalid request.
 *       '401':
 *         description: Invalid credentials.
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Token refresh response.
 *       '401':
 *         description: Refresh token is invalid or expired.
 *
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout response.
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /api/admin/qualification:
 *   post:
 *     tags: [Qualifications]
 *     summary: Create a qualification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Qualification created.
 *   get:
 *     tags: [Qualifications]
 *     summary: Get qualifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Qualifications fetched.
 *
 * /api/admin/qualification/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   put:
 *     tags: [Qualifications]
 *     summary: Update a qualification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Qualification updated.
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Qualifications]
 *     summary: Delete a qualification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Qualification deleted.
 *
 * /api/admin/doctor:
 *   post:
 *     tags: [Doctors]
 *     summary: Register a doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Doctor created.
 *   get:
 *     tags: [Doctors]
 *     summary: Get all doctors or one doctor by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Doctors fetched.
 *
 * /api/admin/doctor/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   put:
 *     tags: [Doctors]
 *     summary: Update a doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Doctor updated.
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete a doctor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Doctor deleted.
 *
 * /api/admin/receptionists:
 *   post:
 *     tags: [Receptionists]
 *     summary: Register a receptionist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Receptionist created.
 *   get:
 *     tags: [Receptionists]
 *     summary: Get receptionists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Receptionists fetched.
 *
 * /api/admin/receptionists/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Receptionists]
 *     summary: Get a receptionist by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Receptionist fetched.
 *   put:
 *     tags: [Receptionists]
 *     summary: Update a receptionist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Receptionist updated.
 *   delete:
 *     tags: [Receptionists]
 *     summary: Delete a receptionist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Receptionist deleted.
 *
 * /api/receptionist/patients:
 *   post:
 *     tags: [Patients]
 *     summary: Register a patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Patient created.
 *   get:
 *     tags: [Patients]
 *     summary: Get patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Patients fetched.
 *
 * /api/receptionist/patients/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Patients]
 *     summary: Get a patient by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Patient fetched.
 *   put:
 *     tags: [Patients]
 *     summary: Update a patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Patient updated.
 *   delete:
 *     tags: [Patients]
 *     summary: Delete a patient
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Patient deleted.
 *
 * /api/receptionist/disease:
 *   post:
 *     tags: [Diseases]
 *     summary: Create a disease
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Disease created.
 *   get:
 *     tags: [Diseases]
 *     summary: Get diseases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Diseases fetched.
 *
 * /api/receptionist/disease/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Diseases]
 *     summary: Get a disease by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Disease fetched.
 *   put:
 *     tags: [Diseases]
 *     summary: Update a disease
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Disease updated.
 *   delete:
 *     tags: [Diseases]
 *     summary: Delete a disease
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Disease deleted.
 *
 * /api/receptionist/specialist:
 *   post:
 *     tags: [Specialists]
 *     summary: Create a specialist record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Specialist created.
 *   get:
 *     tags: [Specialists]
 *     summary: Get specialists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Specialists fetched.
 *
 * /api/receptionist/specialist/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Specialists]
 *     summary: Get a specialist by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Specialist fetched.
 *   put:
 *     tags: [Specialists]
 *     summary: Update a specialist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Specialist updated.
 *   delete:
 *     tags: [Specialists]
 *     summary: Delete a specialist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Specialist deleted.
 *
 * /api/receptionist/slots:
 *   post:
 *     tags: [Slots]
 *     summary: Create a slot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Slot created.
 *   get:
 *     tags: [Slots]
 *     summary: Get slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Slots fetched.
 *
 * /api/receptionist/slots/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Slots]
 *     summary: Get a slot by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Slot fetched.
 *   put:
 *     tags: [Slots]
 *     summary: Update a slot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Slot updated.
 *   delete:
 *     tags: [Slots]
 *     summary: Delete a slot
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Slot deleted.
 *
 * /api/receptionist/weekslots:
 *   post:
 *     tags: [Week Slots]
 *     summary: Create a week slot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Week slot created.
 *   get:
 *     tags: [Week Slots]
 *     summary: Get week slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Week slots fetched.
 *
 * /api/receptionist/weekslots/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Week Slots]
 *     summary: Get a week slot by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Week slot fetched.
 *   put:
 *     tags: [Week Slots]
 *     summary: Update a week slot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Week slot updated.
 *   delete:
 *     tags: [Week Slots]
 *     summary: Delete a week slot
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Week slot deleted.
 *
 * /api/doctor/availability:
 *   post:
 *     tags: [Doctor Availability]
 *     summary: Create doctor availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Availability created.
 *   get:
 *     tags: [Doctor Availability]
 *     summary: Get doctor availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Availability records fetched.
 *
 * /api/doctor/availability/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Doctor Availability]
 *     summary: Get availability by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Availability fetched.
 *   put:
 *     tags: [Doctor Availability]
 *     summary: Update availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Availability updated.
 *   delete:
 *     tags: [Doctor Availability]
 *     summary: Delete availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Availability deleted.
 *
 * /api/patient/treatment:
 *   post:
 *     tags: [Treatments]
 *     summary: Create patient treatment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '201':
 *         description: Treatment created.
 *   get:
 *     tags: [Treatments]
 *     summary: Get patient treatments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Treatments fetched.
 *
 * /api/patient/treatment/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/RecordId'
 *   get:
 *     tags: [Treatments]
 *     summary: Get a treatment by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Treatment fetched.
 *   put:
 *     tags: [Treatments]
 *     summary: Update a treatment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenericRequest'
 *     responses:
 *       '200':
 *         description: Treatment updated.
 *   delete:
 *     tags: [Treatments]
 *     summary: Delete a treatment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Treatment deleted.
 */
export { };