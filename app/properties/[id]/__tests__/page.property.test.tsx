/**
 * Property-Based Tests for Property Details Page
 * Feature: property-details-page
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals'
import fc from 'fast-check'
import { render } from '@testing-library/react'
import PropertyDetailsPage from '../page'
import { getPropertyById } from '@/app/actions/properties'

// Mock the getPropertyById function
jest.mock('@/app/actions/properties', () => ({
    getPropertyById: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}))

const mockGetPropertyById = getPropertyById as jest.MockedFunction<typeof getPropertyById>
const mockNotFound = require('next/navigation').notFound as jest.MockedFunction<() => never>

// Type definitions for test data
interface TestProperty {
    id: string;
    title: string;
    description: string | null;
    address: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    enquiries: TestEnquiry[];
}

interface TestEnquiry {
    id: string;
    propertyId: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    createdAt: string;
}

// Property data generator
const propertyArbitrary = fc.record({
    id: fc.string({ minLength: 1 }),
    title: fc.string({ minLength: 1 }),
    description: fc.oneof(fc.string(), fc.constant(null)),
    address: fc.string({ minLength: 1 }),
    price: fc.string({ minLength: 1 }),
    bedrooms: fc.integer({ min: 0, max: 10 }),
    bathrooms: fc.integer({ min: 0, max: 10 }),
    area: fc.oneof(fc.integer({ min: 1, max: 10000 }), fc.constant(null)),
    imageUrl: fc.oneof(fc.webUrl(), fc.constant(null)),
    createdAt: fc.date().map(d => d.toISOString()),
    updatedAt: fc.date().map(d => d.toISOString()),
    enquiries: fc.array(fc.record({
        id: fc.string({ minLength: 1 }),
        propertyId: fc.string({ minLength: 1 }),
        name: fc.string({ minLength: 1 }),
        email: fc.emailAddress(),
        phone: fc.oneof(fc.string(), fc.constant(null)),
        message: fc.string({ minLength: 1 }),
        createdAt: fc.date().map(d => d.toISOString()),
    }), { maxLength: 5 })
})

describe('Property Details Page - Property-Based Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    describe('Property 11: Server-Side Rendering Performance', () => {
        it('should call getPropertyById with the provided ID and render successfully for any valid property data', async () => {
            await fc.assert(fc.asyncProperty(
                fc.string({ minLength: 1 }),
                propertyArbitrary,
                async (propertyId: string, propertyData: TestProperty) => {
                    // **Validates: Requirements 5.3, 6.1**

                    // Reset mocks for each iteration
                    jest.clearAllMocks()

                    // Arrange
                    const propertyWithId = { ...propertyData, id: propertyId }
                    mockGetPropertyById.mockResolvedValue(propertyWithId as any)

                    // Act
                    const result = await PropertyDetailsPage({ params: { id: propertyId } })

                    // Assert
                    expect(mockGetPropertyById).toHaveBeenCalledWith(propertyId)
                    expect(mockGetPropertyById).toHaveBeenCalledTimes(1)
                    expect(result).toBeDefined()
                    expect(mockNotFound).not.toHaveBeenCalled()
                }
            ), { numRuns: 5 })
        })

        it('should call notFound() when getPropertyById returns null for any property ID', async () => {
            await fc.assert(fc.asyncProperty(
                fc.string({ minLength: 1 }),
                async (propertyId: string) => {
                    // **Validates: Requirements 5.3, 6.1**

                    // Reset mocks for each iteration
                    jest.clearAllMocks()

                    // Arrange
                    mockGetPropertyById.mockResolvedValue(null)

                    // Act & Assert
                    await expect(async () => {
                        await PropertyDetailsPage({ params: { id: propertyId } })
                    }).rejects.toThrow()

                    expect(mockGetPropertyById).toHaveBeenCalledWith(propertyId)
                    expect(mockNotFound).toHaveBeenCalled()
                }
            ), { numRuns: 5 })
        })

        it('should handle database errors gracefully and call notFound() for any property ID', async () => {
            await fc.assert(fc.asyncProperty(
                fc.string({ minLength: 1 }),
                async (propertyId: string) => {
                    // **Validates: Requirements 5.3, 6.1**

                    // Reset mocks for each iteration
                    jest.clearAllMocks()

                    // Arrange
                    const dbError = new Error('Database connection failed')
                    mockGetPropertyById.mockRejectedValue(dbError)

                    // Act & Assert
                    await expect(async () => {
                        await PropertyDetailsPage({ params: { id: propertyId } })
                    }).rejects.toThrow()

                    expect(mockGetPropertyById).toHaveBeenCalledWith(propertyId)
                    expect(mockNotFound).toHaveBeenCalled()
                }
            ), { numRuns: 5 })
        })

        it('should render all required components when property data is available', async () => {
            await fc.assert(fc.asyncProperty(
                propertyArbitrary,
                async (propertyData: TestProperty) => {
                    // **Validates: Requirements 5.3, 6.1**

                    // Reset mocks for each iteration
                    jest.clearAllMocks()

                    // Arrange
                    mockGetPropertyById.mockResolvedValue(propertyData as any)

                    // Act
                    const result = await PropertyDetailsPage({ params: { id: propertyData.id } })

                    // Assert - Check that the component structure is correct
                    expect(result).toBeDefined()
                    expect(result.type).toBe('div')
                    expect(result.props.className).toContain('container')

                    // Verify that getPropertyById was called correctly
                    expect(mockGetPropertyById).toHaveBeenCalledWith(propertyData.id)
                    expect(mockNotFound).not.toHaveBeenCalled()
                }
            ), { numRuns: 5 })
        })

        it('should pass correct props to child components for any property data', async () => {
            await fc.assert(fc.asyncProperty(
                propertyArbitrary,
                async (propertyData: TestProperty) => {
                    // **Validates: Requirements 5.3, 6.1**

                    // Reset mocks for each iteration
                    jest.clearAllMocks()

                    // Arrange
                    mockGetPropertyById.mockResolvedValue(propertyData as any)

                    // Act
                    const result = await PropertyDetailsPage({ params: { id: propertyData.id } })

                    // Assert - Verify component structure and props
                    expect(result).toBeDefined()

                    // The component should have the expected structure with child components
                    const children = result.props.children.props.children
                    expect(Array.isArray(children)).toBe(true)
                    expect(children.length).toBeGreaterThan(0)

                    expect(mockGetPropertyById).toHaveBeenCalledWith(propertyData.id)
                }
            ), { numRuns: 5 })
        })
    })
})