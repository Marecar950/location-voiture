<?php

namespace App\Controller;

use App\Repository\VoitureRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CarController extends AbstractController
{
    #[Route('/car', name: 'app_car', methods: ['GET'])]
    public function index(Request $request, VoitureRepository $voitureRepository): Response
    {
        $departureLocation = $request->request->get('departureLocation');
        $departureDate = $request->request->get('departureDate');
        $returnDate = $request->request->get('returnDate');

        $voitures = $voitureRepository->findVoituresDisponibles($departureLocation, $departureDate, $returnDate);

        return $this->json($voitures);
    }
}
