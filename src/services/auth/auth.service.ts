import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { tokenSecret } from "../../config/config";
import Exception from "../../exceptions/exception";
import { HttpStatus } from "../../exceptions/httpStatus";
import { Auth } from "../../types";
import User from "../../models/user";

class AuthenticationService {
  login = async ({ email, password }: Auth) => {
    try {
      const user = await User.findOne({ email }).select("password");

      if (!user)
        throw new Exception(
          "Email or password incorrect.",
          HttpStatus.UNAUTHORIZED
        );

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch)
        throw new Exception(
          "Email or password incorrect.",
          HttpStatus.UNAUTHORIZED
        );

      const token = sign(
        {
          userId: user._id,
        },
        tokenSecret,
        {
          subject: user.id,
          expiresIn: "1h",
        }
      );
      return token;
    } catch (error: any) {
      throw new Exception(error.message, error.code);
    }
  };
}

export default new AuthenticationService();