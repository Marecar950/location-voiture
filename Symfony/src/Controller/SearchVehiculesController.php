<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Location;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use DateTimeImmutable;

class SearchVehiculesController extends AbstractController
{
    #[Route('/search/vehicules', name: 'app_search_vehicules')]
    public function index(): Response
    {
        return $this->render('search_vehicules/index.html.twig', [
            'controller_name' => 'SearchVehiculesController',
        ]);
    }

    #[Route('/search', name: 'app_search', methods: ['GET', 'POST'])]
    public function search(Request $request, EntityManagerInterface $entityManager): Response
    {
        $lieuDepart = $request->request->get('lieuDepart');
        $dateDepart = $request->request->get('dateDepart');
        $departureDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateDepart);
        $dateRetour = $request->request->get('dateRetour');
        $returnDate = DateTimeImmutable::createFromFormat('Y-m-d', $dateRetour);

        $vehiculesDisponibles = $entityManager->getRepository(Location::class)->findVoituresDisponibles($lieuDepart, $departureDate, $returnDate);

        return $this->json($vehiculesDisponibles);

    }
}
