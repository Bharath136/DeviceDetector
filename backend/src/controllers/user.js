const client = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPassword } = require('./email')


const userRegistration = async (req, res) => {
    const {
        first_name,
        last_name,
        email_address,
        contact_number,
        password,
    } = req.body;

    try {
        // Check if the email address already exists
        const emailCheckQuery = 'SELECT EXISTS (SELECT 1 FROM user_logins WHERE email_address = $1) AS email_exists;';
        const emailCheckResult = await client.query(emailCheckQuery, [email_address]);

        if (emailCheckResult.rows[0].email_exists) {
            return res.status(400).json({ success: false, error: 'Email address already exists' });
        }

        // Hash the password before saving it in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Continue with user registration logic
        const role = 'CUSTOMER';
        const status = 'ACTIVE';

        const insertUserQuery = `
            INSERT INTO user_logins (first_name, last_name, email_address, contact_number, password, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id;
        `;
        const values = [
            first_name,
            last_name,
            email_address,
            contact_number,
            hashedPassword,
            role
        ];

        const result = await client.query(insertUserQuery, values);
        // await sendPassword(email_address, password, first_name, result.rows[0].user_id);

        return res.status(201).json({ success: true, message: 'User registered successfully', user_id: result.rows[0].user_id });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, error: 'Error registering user' });
    }
};

// user login
const userLogin = async (req, res) => {
    const { email_address, password } = req.body;

    try {
        const query = 'SELECT * FROM user_logins WHERE email_address = $1;';
        const result = await client.query(query, [email_address]);

        if (result.rows.length !== 1) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'your-secret-key');

        res.header('x-auth-token', token).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Update user by user_id
const updateUserById = async (req, res) => {
    const id = req.params.id;
    const {
        updated_by,
        first_name,
        last_name,
        email_address,
        contact_number,
        secret_code
    } = req.body;
    const updatedOn = new Date().toISOString();

    try {
        const existingUserQuery = 'SELECT user_id FROM user_logins WHERE email_address = $1 AND user_id <> $2';
        const existingUserResult = await client.query(existingUserQuery, [email_address, id]);

        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email address already exists' });
        }
        const queryParams = [
            `first_name = '${first_name}'`,
            `last_name = '${last_name}'`,
            `contact_number = '${contact_number}'`,
            `secret_code = '${secret_code}'`,
            `status = 'ACTIVE'`,
            `updated_on = '${updatedOn}'`,
            `updated_by = '${updated_by}'`,
        ];
        if (email_address) {
            queryParams.push(`email_address = '${email_address}'`);
        }

        const query = `
            UPDATE user_logins
            SET
            ${queryParams.join(', ')}
            WHERE
            user_id = $1
            RETURNING *;  -- Fetch the updated user details
        `;

        const result = await client.query(query, [id]);

        // Check if any rows were affected
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = result.rows[0];

        res.json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const userQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const userResult = await client.query(userQuery, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deleteQuery = 'DELETE FROM user_logins WHERE user_id = $1';
        await client.query(deleteQuery, [id]);
        res.status(204).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a user by id
const getUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    userRegistration,
    userLogin,
    getUserById,
    deleteUserById,
    updateUserById
}