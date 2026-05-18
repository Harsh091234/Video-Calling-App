import { Request, Response } from "express";

export const sendName = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;

    res.json({
      message: `Welcome ${name}, to MERN-TS-VITE integrated with Shadcn, RTK QUERY`,
    });
  } catch (error: any) {
    console.log("Error in sendName:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};
