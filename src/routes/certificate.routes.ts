import { Router } from "express";
import protectRoute from "../middleware/auth";
import { CreateCertificate , getCertificateAll , getCertificateById , deleteCertificateById} from "../controllers/certificate.controller";

const router = Router();

router.post('/create', protectRoute(), CreateCertificate);
router.get('/all', protectRoute(), getCertificateAll);
router.get('/:id',protectRoute(),getCertificateById)
router.delete('/delete/:id',protectRoute(),deleteCertificateById)
export { router as certificate };