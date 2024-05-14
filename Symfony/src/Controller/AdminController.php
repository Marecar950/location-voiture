<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Admin;
use App\Repository\AdminRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminController extends AbstractController
{
    #[Route('/admin', name: 'app_admin')]
    public function index(): Response
    {
        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    #[Route('/admin/register', name: 'admin_register', methods: ['POST'])]
    public function registerAdmin(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {

        $requestData = json_decode($request->getContent(), true);
        $email = $requestData["email"];
        $plainPassword = $requestData["password"];

        $user = new Admin();
        $user->setEmail($email);

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plainPassword
        );

        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Admin created successfully']);
    }

    #[Route('/admin/login', name: 'admin_login', methods: ['POST'])]
    public function login(Request $request, AdminRepository $adminRepository, UserPasswordHasherInterface $passwordHasher): Response
    {
        $email = $request->request->get('email');
        $plainPassword = $request->request->get('password');

        $admin = $adminRepository->findOneBy(['email' => $email]);

        if (!$passwordHasher->isPasswordValid($admin, $plainPassword)) {
            return new JsonResponse(['error' => 'Adresse e-mail ou mot de passe incorrect']);
        }

        return new JsonResponse(['message' => 'Connexion réussie']);
    }
}
