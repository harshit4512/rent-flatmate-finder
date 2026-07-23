// Purpose of this file:
//
// This middleware is responsible for authorizing users
// based on their role.
//
// Responsibilities:
// - Allow access only to specific roles.
// - Prevent unauthorized users from accessing routes.
//
// Example:
//
// authorize("admin")
//
// authorize("owner", "admin")
//
// authorize("tenant", "owner")
//

// =======================================
// Role Authorization Middleware
//
// Parameters:
// ...roles -> List of allowed roles.
//
// Steps:
//
// 1. Read req.user.role.
// 2. Check whether the role is allowed.
// 3. Continue if allowed.
// 4. Return error if not allowed.
//
// =======================================

function authorize(...roles) {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({

                success: false,
                message: "You are not authorized to access this resource."

            });

        }

        next();

    };

}

// Export middleware
module.exports = {
    authorize
};