// Rasterize page 1 of a PDF to a PNG of the given pixel width (height follows the page).
//   swift scripts/pdf_to_png.swift in.pdf out.png 1920
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 4, let width = Int(args[3]),
      let doc = CGPDFDocument(URL(fileURLWithPath: args[1]) as CFURL),
      let page = doc.page(at: 1) else {
    FileHandle.standardError.write("usage: pdf_to_png.swift in.pdf out.png width\n".data(using: .utf8)!)
    exit(1)
}
let box = page.getBoxRect(.mediaBox)
let scale = CGFloat(width) / box.width
let height = Int((box.height * scale).rounded())
guard let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
                          space: CGColorSpace(name: CGColorSpace.sRGB)!,
                          bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { exit(1) }
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
ctx.interpolationQuality = .high
ctx.scaleBy(x: scale, y: scale)
ctx.translateBy(x: -box.origin.x, y: -box.origin.y)
ctx.drawPDFPage(page)
guard let image = ctx.makeImage(),
      let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: args[2]) as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(1) }
CGImageDestinationAddImage(dest, image, nil)
exit(CGImageDestinationFinalize(dest) ? 0 : 1)
