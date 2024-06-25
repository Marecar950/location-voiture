<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);

        $admin = new Admin();
        $admin->setEmail($data['email']);

        $hashedPassword = $passwordHasher->hashPassword($admin, $data['password']); 
        $admin->setPassword($hashedPassword);
        $admin->setRoles(['ROLE_ADMIN']);

        $em->persist($admin);
        $em->flush();

        return $this->json(['message' => 'Admin created successfully']);
    }

    #[Route('/admin/list_clients', name: 'admin_list_clients', methods:['GET'])]
    public function listClients(EntityManagerInterface $entityManager): Response
    {
        $users = $entityManager->getRepository(User::class)->findAll();
        return $this->json($users);
    }
}
