const Employee = require('../model/Employee');

const getEmployeesById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(200).json({ message: 'Id not found' });
        }
        res.status(200).json({ employee });
    } catch (err) {
        console.error('Error fetching employees :', err);
        res.status(500).json({ error: 'Failed to fetch employees ' });
    }
};

const getEmployees = async (req, res) => {
    try {
        let { page = 1, limit = 10, sort, filter, sortedColumn } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let query = {};
        let sortOption = {};

        // Implement the filter based on the 'filter' query parameter
        if (filter) {
            query.name = { $regex: new RegExp(filter, 'i') };
            // You can extend this based on your specific filter criteria
        }

        if (!sortedColumn) {
            sortedColumn = 'name'; // Default column to sort
        }

        let sortDirection = 1; // Default sort direction (ascending)

        if (sort) {
            // sortedColumn = sort.replace(/^-/, ''); // Remove '-' from the column name
            sortDirection = sort == 'desc' ? -1 : 1;
        }

        sortOption[sortedColumn] = sortDirection;

        const totalEmployees = await Employee.countDocuments(query);
        const totalPages = Math.ceil(totalEmployees / limit);

        const employees = await Employee.find(query)
            .sort(sortOption)
            .limit(limit)
            .skip((page - 1) * limit);

        res.status(200).json({
            employees,
            page,
            totalPages,
            totalEmployees,
            sortedColumn,
            sortDirection, // Include the sort direction in the response
        });
    } catch (error) {
        console.error('Error fetching employees :', error);
        res.status(500).json({ error: 'Failed to fetch employees ' });
    }
};

const addEmployees = async (req, res) => {
    try {
        let { email, name, dob, designation, education } = req.body;
        console.log(name);
        if (!email || !name || !dob || !designation || !education) {
            return res.status(200).json({
                error: 'Please provide all the details to add new employee',
            });
        }
        const user = await Employee.findOne({ email });
        if (user) {
            return res.status(200).json({ error: 'Email is already in used.' });
        }
        const newEmployee = new Employee(req.body);
        console.log(req.body);
        await newEmployee.save();
        res.status(200).json({
            message: 'Employee added successfully',
            newEmployee,
        });
    } catch (error) {
        console.error('Error creating a new employee:', error);
        res.status(500).json({ error: 'Failed to create a new employee' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updatedData = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            updatedData,
            {
                new: true,
            }
        );
        if (updatedEmployee) {
            res.status(200).json({
                message: 'Updated Successfully',
                updatedEmployee,
            });
        } else {
            res.status(500).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went Wrong' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const result = await Employee.findByIdAndDelete(employeeId);
        if (result) {
            res.status(200).json({
                message: `Employee deleted successfully for id - ${employeeId}`,
            });
        } else {
            res.status(500).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting a employee:', error);
        res.status(500).json({ error: 'Failed to delete a employee' });
    }
};

module.exports = {
    getEmployees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeesById,
};
