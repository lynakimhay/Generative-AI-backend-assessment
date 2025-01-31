import { Request, Response } from "express";
import { Certificate } from "../entity/certificate.entity";
import { AppDataSource } from "../config/data-source";
import { UserInfo } from "../entity/user.entity";
import { Roadmap } from "../entity/roadmap.entity";
import { certificate } from "../routes/certificate.routes";
export const CreateCertificate = async (req: Request, res: Response) => {
  try {
    const { userId, courseName } = req.body;
    if (!userId || !courseName) {
      return res.status(400).json({ message: "userId and courseName are required" });
    }
    const userRepository = AppDataSource.getRepository(UserInfo);
    const user = await userRepository.findOne({ where: { id: userId } });
    console.log("User lookup result:", user);
    
    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }
    const certificateRepository = AppDataSource.getRepository(Certificate);
    const newCertificate = certificateRepository.create({
      user, 
      courseName,
    });
    await certificateRepository.save(newCertificate);
    return res.status(201).json({
      id: newCertificate.id,
      userId: user.id, 
      courseName: newCertificate.courseName,
      createdAt: newCertificate.createdAt,
    });

  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};


export const getCertificateAll = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const certificateRepo = AppDataSource.getRepository(Certificate);

  try {
    const certificate = await certificateRepo.find({
      where: { user: {id:userId} },
    });
    return res.status(200).json(certificate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCertificateById = async (req: Request, res: Response) => {
  const { id } = req.params;  
  const certificateRepo = AppDataSource.getRepository(Certificate); 
  try {
    const certificate = await certificateRepo.findOneBy({
        id 
    });
    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    return res.status(200).json(certificate);
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteCertificateById = async (req: Request, res: Response) => {
  const certificateRepo = AppDataSource.getRepository(Certificate)
  try {
      const id = req.params.id;
      if (!id) {
          return res.status(400).json({ message: "Id is required" })
      }
      const certificate = await certificateRepo.findOne({
          where: { id }
      });
      if (!certificate) {
          return res.status(404).json({ message: "Certificate not found" })
      }
      await certificateRepo.delete(certificate);
      return res.status(200).json({ message: "Certificate deleted successfully"  });
  } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Internal server error" });
  }
}


